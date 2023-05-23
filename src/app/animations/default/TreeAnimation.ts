import type { Tree } from "@/app/structures/Tree";
import type { Node } from "@/app/structures/Node";
import { NodeAnimations } from "@/app/animators/common/NodeAnimations";
import { Color } from "three";

export abstract class TreeAnimation {
	tree: Tree;
	valueToFind: number;
	steps: (() => Promise<void>)[];
	stopExecution: boolean;

	protected constructor(tree: Tree, valueToFind: number) {
		this.tree = tree;
		this.stopExecution = false;
		this.valueToFind = valueToFind;
		this.steps = [];
	}

	abstract createSteps(): void;

	protected addNodeSteps(node: Node, isTarget: boolean) {
		if (isTarget) {
			this.steps.push(async () => {
				console.log("NODE FOUND!!!");

				NodeAnimations.shiftNodeColor(node, new Color(0xFFD700));
				NodeAnimations.changeNodeRadius(node, 0.15, 1000);

				// Color the path back to the root green
				let parent = node.parent;
				while (parent) {
					await NodeAnimations.shiftNodeColor(parent, new Color(0x008000)); // green
					parent.setNonColorable();
					parent = parent.parent;
				}

				NodeAnimations.changeNodeRadius(node, 0.1, 1000);

				this.stopExecution = true;
			});
		} else {
			this.steps.push(() => NodeAnimations.shiftNodeColor(node, new Color(0xFF0000))); // red
		}
	}

	async start() {
		this.createSteps();
		for (const step of this.steps) {
			// If got stopExecution flag, stop execution
			if (this.stopExecution) {
				break;
			}

			await step();
		}
	}
}
