import * as THREE from "three";
import type { Color } from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { Line2 } from "three/examples/jsm/lines/Line2";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";

export class Line extends THREE.Object3D {
	private start: THREE.Object3D;
	private end: THREE.Object3D;
	public internalLine: Line2;

	constructor(scene: any, start: THREE.Vector3, end: THREE.Vector3, color: number, linewidth: number) {
		super();

		// Create a new LineGeometry
		const geometry = new LineGeometry();
		geometry.setPositions([start.x, start.y, start.z, end.x, end.y, end.z]);

		// Create a new LineMaterial
		const material = new LineMaterial({
			color: <number><unknown>(new THREE.Color(color)),
			linewidth: linewidth,  // linewidth is now in pixels
			resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)  // to be updated on resize
		});

		// Create a new Line2
		this.internalLine = new Line2(geometry, material);
		// Don't forget to compute lineDistances for the shader
		this.internalLine.computeLineDistances();

		this.add(this.internalLine);

		this.start = new THREE.Object3D();
		this.start.position.copy(start);
		scene.addToScene(this.start);

		this.end = new THREE.Object3D();
		this.end.position.copy(end);
		scene.addToScene(this.end);

		// Add this line to the scene
		scene.addToScene(this.internalLine);

		// And add it to the animator
		scene.addAnimator({
			animated_obj: this.internalLine,
			animate: () => {
				// Update the positions of the line vertices
				const vertices = [this.start.position.clone(), this.end.position.clone()];
				this.geometry.setPositions([vertices[0].x, vertices[0].y, vertices[0].z, vertices[1].x, vertices[1].y, vertices[1].z]);
				this.internalLine.computeLineDistances();
			}
		});
	}

	setPosition(start: THREE.Vector3, end: THREE.Vector3, duration: number) {
		new TWEEN.Tween(this.start.position)
			.to(start, duration)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.start();

		new TWEEN.Tween(this.end.position)
			.to(end, duration)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.start();
	}

	blink(color: Color, times: number) {
		console.log(`Blinking ${times} times with color ${JSON.stringify(color)}`);

		const originalColor = (this.internalLine.material as unknown as THREE.LineBasicMaterial).color.clone();
		const colorObject = { r: color.r, g: color.g, b: color.b };

		const blinkOnce = () => {
			return new Promise<void>(resolve => {
				new TWEEN.Tween((this.internalLine.material as unknown as THREE.LineBasicMaterial).color)
					.to(colorObject, 500)
					.onComplete(() => {
						new TWEEN.Tween((this.internalLine.material as unknown as THREE.LineBasicMaterial).color)
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
				new TWEEN.Tween((this.internalLine.material as unknown as THREE.LineBasicMaterial).color)
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

	get geometry() {
		return this.internalLine.geometry as LineGeometry;
	}
}
