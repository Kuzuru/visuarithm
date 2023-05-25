import type { Circle } from "@/app/objects/Circle";
import type { Edge } from "@/app/structures/Edge";

export class Node {
	data: number;
	parent: Node | null;
	children: Node[];
	circle: Circle | null;
	nonColorable: boolean;
	connectedEdges: Edge[];

	constructor(data: number) {
		this.data = data;
		this.parent = null;
		this.children = [];
		this.circle = null;
		this.nonColorable = false;
		this.connectedEdges = [];
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