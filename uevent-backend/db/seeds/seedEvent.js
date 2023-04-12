/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    await knex('event').insert([
      {id: 1, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-20T13:00:00.00"},
      {id: 2, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-217T13:00:00.00"},
      {id: 3, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-22T13:00:00.00"},
      {id: 4, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-22T13:00:00.00"},
      {id: 5, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-22T13:00:00.00"},
      {id: 6, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-22T13:00:00.00"},
      {id: 7, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-22T13:00:00.00"},
      {id: 8, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-22T13:00:00.00"},
      {id: 9, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-22T13:00:00.00"},
      {id: 10, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-22T13:00:00.00"},
      {id: 11, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-22T13:00:00.00"},
      {id: 12, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-22T13:00:00.00"},
      {id: 13, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-22T13:00:00.00"},
      {id: 14, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-22T13:00:00.00"},
      {id: 15, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-22T13:00:00.00"},
      {id: 16, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-13T13:00:00.00"},
      {id: 17, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-13T13:00:00.00"},
      {id: 18, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-13T13:00:00.00"},
      {id: 19, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-01T13:00:00.00"},
      {id: 20, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-14T13:00:00.00"},
      {id: 21, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-14T13:00:00.00"},
      {id: 22, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-18T13:00:00.00"},
      {id: 23, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-18T13:00:00.00"},
      {id: 24, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-18T13:00:00.00"},
      {id: 25, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-22T13:00:00.00"},
      {id: 26, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-26T13:00:00.00"},
      {id: 27, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-26T13:00:00.00"},
      {id: 28, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-26T13:00:00.00"},
      {id: 29, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-26T13:00:00.00"},
      {id: 30, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-26T13:00:00.00"},
      {id: 31, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-26T13:00:00.00"},
      {id: 32, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-26T13:00:00.00"},
      {id: 33, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-26T13:00:00.00"},
      {id: 34, organizer_id: 1,title:'BururiEvent',description:"Some description",location:"Ukraine",format:"festival",price:"150", seat:"20",event_datetime:"2023-04-26T13:00:00.00"},

    ]);
  };