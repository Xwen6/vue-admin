import request from '@/utils/request'

export default{
    addHouse(house){
        return request({
            url: `/communityService/House/addHouse`,
            method: 'post',
            data:house
          })
    },

    updateHouse(house){
        return request({
            url: `/communityService/House/updateHouse`,
            method: 'post',
            data:house
          })
    },
    


    deleteHouse(code){
        return request({
            url: `/communityService/House/deleteHouse/${code}`,
            method: 'delete',
          })
    },

    getHouseList(current,limit,QueryCondition){
        return request({
            url:`/communityService/House/pageList/${current}/${limit}`,
            method :"post",
            data: QueryCondition

        })
    },

    getHouseByCode(code){
        return request({
            url: `/communityService/House/getHouseByCode/${code}`,
            method:"get"
        })
    }
  
    

}

