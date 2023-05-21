import type { ObjectAnimator } from "@/app/animatiors/ObjectAnimator";
import type { Mesh } from "three";

export class RotationAnimator implements ObjectAnimator {
	animated_obj: Mesh;
	private xRotationSpeed: number;
	private yRotationSpeed: number;

	constructor(mesh: Mesh, xRotationSpeed: number, yRotationSpeed: number) {
		this.animated_obj = mesh;
		this.xRotationSpeed = xRotationSpeed;
		this.yRotationSpeed = yRotationSpeed;
	}

	get xRotSpeed(): number {
		return this.xRotationSpeed;
	}

	set xRotSpeed(value: number) {
		this.xRotationSpeed = value;
	}

	get yRotSpeed(): number {
		return this.yRotationSpeed;
	}

	set yRotSpeed(value: number) {
		this.yRotationSpeed = value;
	}

	animate() {
		this.animated_obj.rotation.x += this.xRotationSpeed;
		this.animated_obj.rotation.y += this.yRotationSpeed;
	}
}