import type { Circle } from "@/app/objects/Circle";

export class Node {
	data: number;
	parent: Node | null;
	children: Node[];
	circle: Circle | null;
	nonColorable: boolean;

	constructor(data: number) {
		this.data = data;
		this.parent = null;
		this.children = [];
		this.circle = null;
		this.nonColorable = false;
	}

	setNonColorable() {
		this.nonColorable = true;
	}

	addChild(node: Node) {
		// Ensure the node is not already in the tree
		if (this.children.find(child => child.data === node.data) === undefined) {
			node.parent = this;
			this.children.push(node);
		}
	}
}