import { API } from "../../utils/API";
import { Offering } from "../types/Offering";
import { Pageable } from "../types/Pageable";

export const getOffersByBusinessId = (businessId: number | string): Promise<Pageable<Offering>> => {
    return new Promise((resolve, reject) => {
        API.get(`/api/offerings/business/${businessId}`)
            .then(res => {
                resolve(res.data); // res.data tartalmazza a Pageable objektumot
            })
            .catch(err => reject(err));
    });
}