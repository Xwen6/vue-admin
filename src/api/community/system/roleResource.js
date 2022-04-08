import request from '@/utils/request'

export default{
    getIds(roleId){
        return request({
            url: `/loginService/role-permission/list?roleId=${roleId}`,
            method: 'get',
        })
    },

    save(Params){
        return request({
            url: `/loginService/role-permission/save`,
            method: 'post',
            data: Params
        })
    },

   
   

}

