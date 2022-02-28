import request from '@/utils/request'

export default{
    addCommunity(Community){
        return request({
            url: `/communityService/Community/addCommunity`,
            method: 'post',
            data:Community
          })
    },

    updateCommunity(Community){
        return request({
            url: `/communityService/Community/update`,
            method: 'post',
            data:Community
          })
    },
    


    deleteCommunity(id){
        return request({
            url: `/communityService/Community/deleteById/${id}`,
            method: 'delete',
          })
    },

    pageList(current,limit,QueryCondition){
        return request({
            url:`/communityService/Community/pageList/${current}/${limit}`,
            method :"post",
            data: QueryCondition

        })
    },

    getCommunityByCode(code){
        return request({
            url: `/communityService/Community/getByCCode/${code}`,
            method:"get"
        })
    },
    getCommunityList(){
        return request({
            url: `/communityService/Community/getCommunityList`,
            method:"get"
        })
    }
  
    

}

