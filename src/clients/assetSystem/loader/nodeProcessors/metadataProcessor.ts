import { Nullable } from "@babylonjs/core"
import * as BABYLON from "@babylonjs/core"
import { IVideoPlayOptions, VideoPlayBehavior } from "../behaviors/videoPlayBehavior"

export class MetadataProcessor {
    static async processMetadata(node: BABYLON.Node) {
        if (node.metadata) {
            MetadataProcessor._processMetadata_tags(node)
            await MetadataProcessor._processMetadata_behaviors(node)
        }
    }

    private static _processMetadata_tags(node: BABYLON.Node): void {
        if (node.metadata.tags && typeof node.metadata.tags === "string") {
            BABYLON.Tags.EnableFor(node)
            BABYLON.Tags.AddTagsTo(node, node.metadata.tags)
        }
    }

    private static async _processMetadata_behaviors(node: BABYLON.Node): Promise<void> {
        if (node.metadata.behaviors && node.metadata.behaviors instanceof Array) {
            const behaviors = node.metadata.behaviors
            for (let ii = 0;ii < behaviors.length;++ii) {
                const behavior = behaviors[ii]
                if (behavior.name && typeof behavior.name === "string") {
                    const createdBehavior = MetadataProcessor._createBehaviour(behavior.name, behavior.options)
                    if (createdBehavior) {
                        node.addBehavior(createdBehavior)
                    }
                }
            }
        }
    }

    private static _createBehaviour(name: string, options: any): Nullable<BABYLON.Behavior<BABYLON.Node>> {
        switch (name) {
            case VideoPlayBehavior.BEHAVIOR_NAME:
                return new VideoPlayBehavior(options as IVideoPlayOptions)
        }

        return null
    }
}