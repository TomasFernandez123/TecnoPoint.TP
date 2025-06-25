
module.exports = (request, response, next)=>{

    if( ! request.session.usuario ){
        return response.redirect("/admin/login");
    }

    response.locals.usuario = request.session.usuario;

    next();
};