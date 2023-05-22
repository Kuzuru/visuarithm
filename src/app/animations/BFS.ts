import { Color } from "three";
import type { Tree } from "@/app/structures/Tree";
import type { Node } from "@/app/structures/Node";
import { NodeAnimations } from "@/app/animatiors/common/NodeAnimations";
import { TreeAnimation } from "@/app/animations/default/TreeAnimation";

export class BFS extends TreeAnimation {
	constructor(tree: Tree, valueToFind: number) {
		super(tree, valueToFind);
	}

	createSteps() {
		const queue: Node[] = [];

		if (this.tree.root) {
			queue.push(this.tree.root);
		}

		while (queue.length > 0) {
			const node = queue.shift();

			if (node) {
				this.steps.push(() => NodeAnimations.blinkNode(node, new Color(0x0000FF))); // blue

				if (node.data !== this.valueToFind) {
					this.steps.push(() => NodeAnimations.shiftNodeColor(node, new Color(0xFF0000))); // red
				} else {
					this.steps.push(async () => {
						console.log("NODE FOUND!!!");

						NodeAnimations.shiftNodeColor(node, new Color(0xFFD700)); // gold
						NodeAnimations.changeNodeRadius(node, 0.15, 1000);

						// Colour the whole path back in green
						let parent = node.parent;
						while (parent) {
							await NodeAnimations.shiftNodeColor(parent, new Color(0x008000)); // green
							parent.setNonColorable();
							parent = parent.parent;
						}

						NodeAnimations.changeNodeRadius(node, 0.1, 1000);

						this.stopExecution = true;
					});
				}

				for (let i = 0; i < node.children.length; i++) {
					queue.push(node.children[i]);
				}
			}
		}
	}
}
