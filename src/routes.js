const express = require ('express');
const routes = express.Router();
const gradecontroller = require('./Controllers/gradescontroller')

routes.get('/all', gradecontroller.grades);
routes.post('/new', gradecontroller.newgrade);
routes.put('/update/:id', gradecontroller.updategrade);
routes.delete('/delete/:id', gradecontroller.deletegrade);
routes.get('/grade/:id', gradecontroller.specificgrade);
routes.put('/grade/total', gradecontroller.totalgrade);
routes.put('/grade/mean', gradecontroller.meangrade);
routes.put('/grade/best', gradecontroller.bestgrade);

module.exports = routes;