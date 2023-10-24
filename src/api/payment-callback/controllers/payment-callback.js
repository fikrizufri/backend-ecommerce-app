'use strict';

/**
 * payment-callback controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::payment-callback.payment-callback',({strapi})=>({
  async create(ctx){
    let requireData = ctx.request.body;
    console.log('request xendit', requireData);

    let order = await strapi.service('api::order.order').findOne(parseInt(requireData.external_id));
    let inputData = {'data':{'history':requireData}};
    const result = await strapi.service('api::payment-callback.payment-callback').create(inputData);

    console.log(requireData);

    let param = {};

    if(requireData.status ='PAID'){
      param = {'data':{'status':'packaging'}}
    }else{
      param = {'data':{'status':'cancel'}}
    }

    let updateOrder=await strapi.service('api::order.order').update(parseInt(requireData.external_id), param);
    return {'data':updateOrder}
  }
}) );
