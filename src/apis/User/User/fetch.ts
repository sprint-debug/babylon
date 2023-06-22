import { UserAvailabilityParams } from "./type";
import onRequest, {RequestInstance} from "@/common/utils/fetch";


export async function getUserAvailability(instance:RequestInstance, params:UserAvailabilityParams) {
    return await onRequest(instance, "/v1/user/availability/id", {method : "GET", params});
} 