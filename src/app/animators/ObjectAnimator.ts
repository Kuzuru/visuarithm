import type { Object3D } from "three";

export interface ObjectAnimator {
	animated_obj: Object3D;

	animate();
}