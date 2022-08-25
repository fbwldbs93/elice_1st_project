import {AwardModel} from "../schemas/award"

class Award{
    static async create(newAward){
        const createAward = await AwardModel.create(newAward)
        return createAward;
    }

    static async findById(id){
        const findAward = await AwardModel.findOne({id})
        return findAward;
    }

    static async update(updateData){

        const {id, fieldToUpdate, newValue} = updateData;

        const filter = id;
        const update = { [fieldToUpdate]: newValue };
        const option = { returnOriginal: false };

        console.log("🐸 업데이트할 녀석들 체-크!", updateData)
        
        const updateAward = await AwardModel.findOneAndUpdate(
            filter,
            update,
            option
        )

        return updateAward;
    }
}

export {Award}