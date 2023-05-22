import { Color } from "three";
import type { Tree } from "@/app/structures/Tree";
import type { Node } from "@/app/structures/Node";
import { NodeAnimations } from "@/app/animatiors/common/NodeAnimations";
import { TreeAnimation } from "@/app/animations/default/TreeAnimation";

export class DFS extends TreeAnimation {
	constructor(tree: Tree, valueToFind: number) {
		super(tree, valueToFind);
	}

	createSteps(node: Node | null = this.tree.root) {
		if (!node) {
			return;
		}

		// Add animation step for the current node
		this.steps.push(() => NodeAnimations.blinkNode(node, new Color(0x0000FF))); // blue

		for (let i = 0; i < node.children.length; i++) {
			const child = node.children[i];
			this.createSteps(child);
		}

		// Add steps for the node based on whether it's the target node or not
		this.addNodeSteps(node, node.data === this.valueToFind);
	}

}
