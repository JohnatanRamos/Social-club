## TODO List for reach 1.0.0 social club web page version.

#### **Scope:** 

The scope project is to create a web page for "Social Club" company. The web page will be used to enroll in courses and validate the payment of the courses.

### External configuration

- [X] Configurate N8N enviroment 
- [X] Configurate chatwoot enviroment.
- [X] Flow for emails to the Admin.
- [X] Create listener flow for file's Google Drive.
- [X] Create flow to send file data Courses to API.
- [X] Create flow to send file data Events to API.
- [X] Create Error Flow.
- [X] Configure "Wompi" credentials.
- [X] Configure "Cloudinary".
- [X] Flow for updated enrollment file in Google Drive.
- [X] Configure "Cluster Mongo" With my Company email.
- [X] Create template message.
- [X] Deploy app to production.
- [ ] Integrate Meta with Chatwoot.
- [ ] Flow for error messaege when the payment is not successful.
- [X] Configure correct sheet template course.
- [X] Configure correct sheet template event.
- [X] Configurate domain.
- [] Change Keys environments for production.

---

### Backend

- [ ] Deploy API for testing.
- [ ] Implement cache for API.
- [ ] EndPoint for get courses and events.
- [ ] EndPoint for create massive courses.
- [ ] EndPoint for create massive events.
- [ ] Remove Data Collection in MongoDB, when the create endpoint is called.
- [ ] Webhook endpoint for "Wompi" when the transaction is finished.
- [ ] Validate the best option for deploy API.
- [ ] Agregar campo de 2x1 en el formulario de cursos de excel.
- [ ] Implements email error transaction from webhook wompi.

---

### Frontend

- [X] Call API to get all.
- [X] Install React.
- [X] Create Form to enroll in courses.
- [X] "Add to cart" functionality.
- [X] Functionality to remove course from cart.
- [X] Persistent cart functionality, using the local storage.
- [X] Doesn't allow to add the same course more than once.
- [X] Doesn't allow to add different location courses.
- [X] Create "More information" window about the discount courses.
- [X] Create "Related Courses" carousel.
- [X] Discounts validations.
- [X] Configure payment gateway.
- [X] Create "Finalize Enrollment" page.
- [X] Validate called "Wompi" status payment.
- [X] Function after finish the payment.(Clean the cart)
- [X] Filtros para cursos y eventos.
- [X] Clean the cart after finish the payment should be just when the payment is successful or the payment is pending.
- [X] When the ckeckbox "Pago de contado" is not checked, when the user click in the "Finalizar Inscripción" the system should render to the succes page, because is not necessary to pay.
- [X] Validate correct information in the checkout form.
- [X] Add alerts.
- [X] Lock the button "inscribirme" when the capacity is completed.
- [X] Lock the button "En pareja" when the capacity is almost complete.
- [X] Reservation api integration.
- [X] Adds color to the current link menu.
- [X] Adjustment to the reference with the return reference.
- [X] Actualizar react.
- [X] Page privacy policy.
- [] Change copies.
- [] Change images.
- [] Change colors.
- [] Change letter.
- [] Mobile implementation.
- [X] Fix the filters.
- [X] Adjust the events page.
- [X] Configure the buttons to send to wpp.
- [X] Configure the colors events.


---

### Testing

- [] Test with slow internet connection.
- [] Test with no internet connection.
- [] Test massive user requests.
- [] Test the concurrency of users.
- [] Test the differents wompi status.

---


Boton de limpiar filtros.



https://sandbox.wompi.co/v1/transactions/12004440-1765806653-78678

https://production.wompi.co/v1/transactions/{TRANSACTION_ID}


Academiainvritmovivo@gmail.com

Ajustar los correso de produccion.
Que va pasar con la data que ya fue guardada en el localstorage ? y se actualizo los cursos.


Ajsutar ramas para los pipelines.
Cambiar los dates

http://72.60.114.240:3000/

si me inscribo a tres cursos diferente deberia de mostrar el mismo mensaje ?
enviar location y hora
no funciona el menu en celular
no muestra el titulo de la clase en mobile

[X] bug del 15%
[X] por defecto mostrar un lugar.
[x] no abren los acordeones.
[X] Cargar las imagenes de los eventos.
[X] Bug de los correos.
[X] Agregar los menu.
[X] Disminuir peso de imagenes.

[X] Token permanente en google sheets.
[X] Agregar preguntas frecuentas en un json.
[X] Hacer pruebas de cupos completados.
[X] Profesores.
[X] Testimonios.
[X] Ajustar el correo donde se va enviar el correo de confirmación.
[X] Configuración del correo propio donde se van a enviar los mensajes.
[X] Agregar imagenes de cada lugar.
[X] Agregar cuando inician las clases.
[ ] Mejorar la carga del iframe.
[ ] Enviar mensaje via wpp.
[ ] Time expired

*Agregar favicon.


Academiainvritmovivo@gmail.com
auxmarketingritmovivo@gmail.com




  