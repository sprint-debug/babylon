import { Vector3 } from "@babylonjs/core"
export class JsonUtils {
    public static parseToVector3(json: string, vec: Vector3): boolean {
        const v = JSON.parse(json)
        if (v.x === undefined || v.y === undefined || v.z === undefined) {
            vec.x = vec.y = vec.z = 0
            return false
        }

        vec.x = v.x
        vec.y = v.y
        vec.z = v.z
        return true
    }

}