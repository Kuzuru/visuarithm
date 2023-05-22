import type { Node } from "@/app/structures/Node";
import type { Color } from "three";

export abstract class NodeAnimations {
	static blinkNode(node: Node, color: Color) {
		if (node.circle) {
			return node.circle.blink(color, 1, node.data);
		}

		return Promise.resolve();
	}

	static shiftNodeColor(node: Node, color: Color) {
		if (node.circle && !node.nonColorable) {
			return node.circle.smoothBorderColorShift(color);
		}

		return Promise.resolve();
	}

	static changeNodeRadius(node: Node, radius: number, duration: number) {
		if (node.circle) {
			return node.circle.changeRadiusSmoothly(radius, duration);
		}

		return Promise.resolve();
	}
}