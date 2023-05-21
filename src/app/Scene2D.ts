import * as THREE from "three";
import type { ObjectAnimator } from "@/app/animatiors/ObjectAnimator";
import * as TWEEN from "@tweenjs/tween.js";

export type CameraSizes = {
	left: number,
	right: number,
	top: number,
	bottom: number,
}

export class Scene2D {
	private readonly _scene: THREE.Scene;
	private _renderer: THREE.WebGLRenderer;

	public camera: THREE.OrthographicCamera;

	// Array of MeshAnimators for animation updating
	private readonly _animators: ObjectAnimator[] = [];

	camWidth = 8; // set the initial width of the camera view
	private camHeight = this.camWidth / window.innerWidth * window.innerHeight; // calculate the height based on the aspect ratio of the window

	private sizes = {
		left: this.camWidth / -2,
		right: this.camWidth / 2,
		top: this.camHeight / 2,
		bottom: this.camHeight / -2
	} as CameraSizes;

	constructor() {
		// Create a new scene instance
		this._scene = new THREE.Scene();

		this._scene.background = new THREE.Color(0xE2DFD2);

		this.camera = new THREE.OrthographicCamera(
			this.sizes.left,
			this.sizes.right,
			this.sizes.top,
			this.sizes.bottom,
			0.1, // near
			1000 // far
		);

		this.camera.position.set(0, 0, 5);

		// Render
		const canvas: HTMLElement = document.querySelector("#experience") as HTMLElement;

		this._renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: true
		});

		// Updating resolution for the first time
		this.updateProjectionMatrix();

		window.addEventListener("resize", () => {
			this.updateProjectionMatrix();
		});
	}

	addAnimator(animator: {animated_obj: THREE.Object3D, animate: () => void}) {
		this._animators.push(animator);
	}

	addToScene(object: THREE.Object3D) {
		this._scene.add(object);
	}

	updateProjectionMatrix() {
		this.camHeight = this.camWidth / window.innerWidth * window.innerHeight;

		this.camera.left = this.camWidth / -2;
		this.camera.right = this.camWidth / 2;
		this.camera.top = this.camHeight / 2;
		this.camera.bottom = this.camHeight / -2;

		this.updateRenderer();
		this.camera.updateProjectionMatrix();
	}

	updateRenderer() {
		this._renderer.setSize(window.innerWidth, window.innerHeight);
		this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	}

	animate() {
		// Update animators
		for (const animator of this._animators) {
			animator.animate();
		}

		TWEEN.update();

		// Render the scene
		this._renderer.render(this._scene, this.camera);

		// Call animate recursively
		requestAnimationFrame(() => this.animate());
	}

	setCameraPosition(x: number, y: number) {
		this.camera.position.set(x, y, 5);
	}

	get cameraSizes(): CameraSizes {
		return this.sizes;
	}
}
