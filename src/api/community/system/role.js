import request from '@/utils/request'

export default{
    pageList(current,limit,Query){
        return request({
            url: `/loginService/Role/pageList/${current}/${limit}`,
            method: 'post',
            data:Query
          })
    },

    getById(id){
        return request({
            url: `/loginService/Role/getById/${id}`,
            method: 'get'
          })
    },

    add(name,weight,status){
        return request({
            url: `/loginService/Role/add/${name}/${weight}/${status}`,
            method: 'post'
        })
    },

    update(Role){
        return request({
            url: `/loginService/Role/update`,
            method: 'post',
            data: Role
        })
    },

    delete(id){
        return request({
            url: `/loginService/Role/delete/${id}`,
            method: 'delete'
          })
    },

    getList(){
        return request({
            url: `/loginService/Role/getList`,
            method: 'get'
          })
    }
  
    

}

