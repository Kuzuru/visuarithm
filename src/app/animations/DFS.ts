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

		for (let i = 0; i < node.children.length; i++) {
			const child = node.children[i];

			this.steps.push(() => NodeAnimations.blinkNode(child, new Color(0x0000FF))); // blue

			this.createSteps(child);

			if (child.data !== this.valueToFind) {
				this.steps.push(() => NodeAnimations.shiftNodeColor(child, new Color(0xFF0000)));
			} else {
				this.steps.push(async () => {
					console.log("NODE FOUND!!!");

					NodeAnimations.shiftNodeColor(child, new Color(0xFFD700));
					NodeAnimations.changeNodeRadius(child, 0.15, 1000);

					// Закрашиваем весь путь обратно зеленым
					let parent = child.parent;
					while (parent) {
						await NodeAnimations.shiftNodeColor(parent, new Color(0x008000)); // green
						parent.setNonColorable();
						parent = parent.parent;
					}

					NodeAnimations.changeNodeRadius(child, 0.1, 1000);

					this.stopExecution = true;
				});
			}
		}
	}
}
