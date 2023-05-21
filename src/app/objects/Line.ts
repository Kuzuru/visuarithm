import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";

export class Line extends THREE.Object3D {

	private start: THREE.Object3D;
	private end: THREE.Object3D;
	private readonly internalLine: THREE.Line;

	constructor(scene: any, start: THREE.Vector3, end: THREE.Vector3, color: number, linewidth: number) {
		super();

		const material = new THREE.LineBasicMaterial({ color: color, linewidth: linewidth });

		const startObj = new THREE.Object3D();
		startObj.position.copy(start);
		scene.addToScene(startObj);

		const endObj = new THREE.Object3D();
		endObj.position.copy(end);
		scene.addToScene(endObj);

		const geometry = new THREE.BufferGeometry().setFromPoints([startObj.position.clone(), endObj.position.clone()]);

		this.internalLine = new THREE.Line(geometry, material);
		this.add(this.internalLine);

		this.start = startObj;
		this.end = endObj;

		// Add this line to the scene
		scene.addToScene(this.internalLine);

		// And add it to the animator
		scene.addAnimator({
			animated_obj: this.internalLine,
			animate: () => {
				// Update the positions of the line vertices
				const vertices = [this.start.position.clone(), this.end.position.clone()];
				this.geometry.setFromPoints(vertices);
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

	get geometry() {
		return this.internalLine.geometry as THREE.BufferGeometry;
	}
}
