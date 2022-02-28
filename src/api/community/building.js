import request from '@/utils/request'

export default{
    addBuilding(Building){
        return request({
            url: `/communityService/building/addBuilding`,
            method: 'post',
            data:Building
          })
    },

    updateBuilding(Building){
        return request({
            url: `/communityService/building/updateBuilding`,
            method: 'post',
            data:Building
          })
    },
    


    deleteBuilding(code){
        return request({
            url: `/communityService/building/deleteBuilding/${code}`,
            method: 'delete',
          })
    },

    getBuildingList(current,limit,QueryCondition){
        return request({
            url:`/communityService/building/pageList/${current}/${limit}`,
            method :"post",
            data: QueryCondition

        })
    },

    getBuildingByCode(code){
        return request({
            url: `/communityService/building/getBuildingByCode/${code}`,
            method:"get"
        })
    }
  
    

}

