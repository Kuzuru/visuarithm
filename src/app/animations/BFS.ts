import { Color } from "three";
import type { Tree } from "@/app/structures/Tree";
import type { Node } from "@/app/structures/Node";
import { NodeAnimations } from "@/app/animatiors/common/NodeAnimations";
import { TreeAnimation } from "@/app/animations/default/TreeAnimation";
import { Queue } from "@/app/structures/Queue";

export class BFS extends TreeAnimation {
	constructor(tree: Tree, valueToFind: number) {
		super(tree, valueToFind);
	}

	createSteps() {
		const queue = new Queue<Node>();
		if (this.tree.root) {
			queue.enqueue(this.tree.root);
		}

		while (!queue.isEmpty()) {
			const node = queue.dequeue();

			if (!node) {
				continue;
			}

			// Add animation step for the current node
			this.steps.push(() => NodeAnimations.blinkNode(node, new Color(0x0000FF))); // blue

			for (const child of node.children) {
				queue.enqueue(child);
			}

			// Add steps for the node based on whether it's the target node or not
			this.addNodeSteps(node, node.data === this.valueToFind);
		}
	}
}
