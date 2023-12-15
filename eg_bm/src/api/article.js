import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'
//文章分类列表查询
export const articleCategoryListService = ()=>{
    //const tokenStore = useTokenStore();
    //在pinia中定义的响应式数据,都不需要.value
    //return request.get('/category',{headers:{'Authorization':tokenStore.token}})
    return request.get('/category')
}

//文章分类添加
export const articleCategoryAddService = (categoryData)=>{
    return request.post('/category',categoryData)
}

//文章分类修改
export const articleCategoryUpdateService = (categoryData)=>{
   return  request.put('/category',categoryData)
}

//文章分类删除
export const articleCategoryDeleteService = (id)=>{
    return request.delete('/category?id='+id)
}

//文章列表查询
export const articleListService = (params)=>{
   return  request.get('/article',{params:params})
}

//文章添加
export const articleAddService = (articleData)=>{
    return request.post('/article',articleData);

}

export const giftListService = (params)=>{
    return request.get('/gift',{params:params});

}

export const giftListAllService = (params)=>{
    return request.get('/gift/detail',{params:params});
}

export const giftGetService = ()=>{
    return request.get('/gift/');
}

export const giftOrderService = (params)=>{
    return request.get('/gift/order',{params:params});
}

export const giftCategoryService = ()=>{
    return request.get('/category');
}

export const giftInfoService = (id)=>{
    return request.get('/gift/one?id='+id);
}

export const giftImgsService = (giftId)=>{
    return request.get('/gift/img?giftId='+giftId);
}


export const giftChangeStService =(id)=>{
    return request.post('/gift/change?id='+id);
}

//查询所有商品信息
export const goodListService = (params)=>{
    return request.get('/good',{params:params});
}
//根据id查询信息
export const goodInfoService = (name)=>{
    return request.get('/good?goodName='+name);
}

export const goodOrderListService = (params)=>{
    return request.get('/good/order',{params:params});
}

export const goodSendService =(OrderData) =>{
    return request.post('/good/order/send',OrderData);
}