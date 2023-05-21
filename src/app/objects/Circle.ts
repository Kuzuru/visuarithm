import * as THREE from "three";
import { Color, Vector2 } from "three";
import type { Scene2D } from "@/app/Scene2D";
import * as TWEEN from "@tweenjs/tween.js";
import { generateUUID } from "three/src/math/MathUtils";

export class Circle {
	private vID: string;
	private _defaultSegments = 128;

	private _currentScene: Scene2D;

	private _radius: number;
	private _basicColor: Color;

	private _borderMesh!: THREE.Mesh;
	private _colorMesh!: THREE.Mesh;

	private _xPos: number;
	private _yPos: number;

	constructor(scene: Scene2D, radius: number, xPos: number = 0, yPos: number = 0, color: Color = new Color(0xFFFFFF)) {
		this.vID = generateUUID();
		this._currentScene = scene;

		this._radius = radius;
		this._basicColor = color;

		this._xPos = xPos;
		this._yPos = yPos;

		this._drawCircle(this._currentScene, this._radius, this._xPos, this._yPos, this._basicColor);
	}

	/*
	 * @param {Scene2D} scene Текущая сцена, на которой необходимо отрисовать круг
	 * @param {number} xPos Позиция по оси OX
	 * @param {number} yPos Позиция по оси OY
	 * @param {number} radius Радиус окружности
	 * @param {Color} color Базовый цвет
	 * @returns Отрисовывает круг на конкретной сцене
	 */
	private _drawCircle(scene: Scene2D, radius: number, xPos: number = 0, yPos: number = 0, color: Color) {
		const cRadius = radius;
		const segments = this._defaultSegments;

		// 0x50C878 -> Glow Effect (Emerald Color)
		const colorMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

		// Create a larger circle with the border material
		const borderRadius = cRadius * 1.1; // Make it slightly larger than the color circle
		const borderGeometry = new THREE.CircleGeometry(borderRadius, segments);
		const borderMaterial = new THREE.MeshBasicMaterial({ color: color, side: THREE.FrontSide });
		this._borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);

		// Create a mesh for the color circle and add it to the scene
		const colorGeometry = new THREE.CircleGeometry(cRadius, segments);
		this._colorMesh = new THREE.Mesh(colorGeometry, colorMaterial);

		// Make sure the color circle is on top of the border circle
		this._colorMesh.position.z = 2;
		this._borderMesh.position.z = 1;

		// Set the position of the color circle
		this._colorMesh.position.setX(xPos);
		this._colorMesh.position.setY(yPos);

		// Set the position of the border circle based on the position of the color circle
		this._borderMesh.position.setX(this._colorMesh.position.x);
		this._borderMesh.position.setY(this._colorMesh.position.y);

		scene.addToScene(this._colorMesh);
		scene.addToScene(this._borderMesh);

		return [this._colorMesh.position.x, this._colorMesh.position.y];
	}

	/*
	 * @param {number} radius Радиус окружности
	 * @param {number} duration Продолжительность анимации в мс
	 * @returns Плавно изменяет размер окружности
	 */
	changeRadiusSmoothly(radius: number, duration: number) {
		console.log(`Changing ${this._radius}R -> ${radius} in ${duration}ms`);

		new TWEEN.Tween({ width: this._radius })
			.to({ width: radius }, duration)
			.easing(TWEEN.Easing.Quintic.InOut)
			.onUpdate(({ width }) => {
				this.setRadius(width);
			})
			.start();
	}

	setRadius(radius: number) {
		this._radius = radius;
		const cRadius = radius;

		// Update color circle geometry
		this._colorMesh.geometry = new THREE.CircleGeometry(cRadius, this._defaultSegments);

		// Update border circle geometry
		const borderRadius = cRadius * 1.1;
		this._borderMesh.geometry = new THREE.CircleGeometry(borderRadius, this._defaultSegments);
	}

	setPositionSmoothly(x: number, y: number, duration: number) {
		console.log(`Moving to ${x}, ${y} in ${duration}ms`);

		const currentPosition = {
			x: this._xPos,
			y: this._yPos
		};

		const targetPosition = {
			x: x,
			y: y
		};

		new TWEEN.Tween(currentPosition)
			.to(targetPosition, duration)
			.easing(TWEEN.Easing.Quintic.InOut)
			.onUpdate(() => {
				this._xPos = currentPosition.x;
				this._yPos = currentPosition.y;

				this.setPosition(currentPosition.x, currentPosition.y);
			})
			.start();
	}

	/*
 	 * @param {number} xPos Позиция по оси OX
 	 * @param {number} yPos Позиция по оси OY
 	 * @returns Изменяет позицию круга
 	 */
	setPosition(xPos: number, yPos: number) {
		this._xPos = xPos;
		this._yPos = yPos;

		// Update color mesh position
		this._colorMesh.position.setX(xPos);
		this._colorMesh.position.setY(yPos);

		// Update border mesh position
		this._borderMesh.position.setX(xPos);
		this._borderMesh.position.setY(yPos);
	}

	setColor(color: Color) {
		this._borderMesh.material = new THREE.MeshBasicMaterial({ color: color });
	}

	blink(color: Color, times: number, node_number?: number) {
		console.log(`Blinking ${times} times${node_number ? ` for node ${node_number} ` : " "}with color ${JSON.stringify(color)}`);

		const originalColor = (this._borderMesh.material as THREE.MeshBasicMaterial).color.clone();
		const colorObject = { r: color.r, g: color.g, b: color.b };

		const blinkOnce = () => {
			return new Promise<void>(resolve => {
				new TWEEN.Tween((this._borderMesh.material as THREE.MeshBasicMaterial).color)
					.to(colorObject, 500)
					.onComplete(() => {
						new TWEEN.Tween((this._borderMesh.material as THREE.MeshBasicMaterial).color)
							.to({ r: originalColor.r, g: originalColor.g, b: originalColor.b }, 500)
							.onComplete(() => {
								resolve();
							})
							.start();
					})
					.start();
			});
		};

		return new Array(times).fill(null).reduce(
			(prev) => prev.then(() => blinkOnce()),
			Promise.resolve()
		);
	}

	smoothBorderColorShift(color: Color) {
		console.log("Smoothing color...");
		const colorObject = { r: color.r, g: color.g, b: color.b };

		const shift = () => {
			return new Promise<void>((resolve) => {
				new TWEEN.Tween((this._borderMesh.material as THREE.MeshBasicMaterial).color)
					.to(colorObject, 500)
					.onComplete(() => {
						resolve();
					})
					.start();
			});
		};

		return new Array(1).fill(null).reduce(
			(prev) => prev.then(() => shift()),
			Promise.resolve()
		);
	}

	get xPos(): number {
		return this._xPos;
	}

	set xPos(xPos: number) {
		this._xPos = xPos;
	}

	get yPos(): number {
		return this._yPos;
	}

	set yPos(yPos: number) {
		this._yPos = yPos;
	}

	get position(): Vector2 {
		return new Vector2(this.xPos, this.yPos);
	}

	get VertexID(): string {
		return this.vID;
	}
}