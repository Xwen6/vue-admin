import request from '@/utils/request'

export default{
    pageList(RepairQuery){
        return request({
            url: `/communityService/Repair/pageList/${current}/${limit}`,
            method: 'post',
            data:RepairQuery
          })
    },

    getDetails(id){
        return request({
            url: `/communityService/Repair/getDetails/${id}`,
            method: 'get',
          })
    },

    getDetails(id){
        return request({
            url: `/communityService/Repair/getById/${id}`,
            method: 'get',
          })
    },

    delete(id){
        return request({
            url: `/communityService/Repair/delete/${id}`,
            method: 'delete',
          })
    },

    update(repair){
        return request({
            url: `/communityService/Repair/update`,
            method: 'post',
            data:repair
          })
    },

  
    

}

