import { Nullable, Scene, Node } from "@babylonjs/core"

export class SceneUtils {
    static findNodeByPath(scene: Scene, objPath: string): Nullable<Node> {
        const splitPaths = objPath.split("/")
        if (splitPaths.length > 0) {
            let curNode = scene.getNodeByName(splitPaths[0])
            let idx = 1
            while (null != curNode && idx < splitPaths.length) {
                curNode = SceneUtils._findChildNodeByName(curNode, splitPaths[idx++])
            }
            return curNode
        }

        return null
    }

    //-----------------------------------------------------------------------------------
    // Private Helpers
    //-----------------------------------------------------------------------------------
    private static _findChildNodeByName(parentNode: Nullable<Node>, name: string): Nullable<Node> {
        if (parentNode) {
            const foundNodes = parentNode.getDescendants(true, c => { return c.name == name })
            if (foundNodes.length > 0) {
                return foundNodes[0]
            }
        }
        return null
    }
}