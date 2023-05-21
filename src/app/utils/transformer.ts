import * as THREE from "three";
import type { Circle } from "@/app/objects/Circle";
import type { UnwrapRef } from "vue";

export function getVector3(circle: UnwrapRef<Circle>): THREE.Vector3 {
	return new THREE.Vector3(circle.position.x, circle.position.y, 0);
}