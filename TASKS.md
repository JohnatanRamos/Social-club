## TODO List for reach 1.0.0 social club web page version.

#### **Scope:** 

The scope project is to create a web page for "Social Club" company. The web page will be used to enroll in courses and validate the payment of the courses.

### External configuration

- [X] Configurate N8N enviroment 
- [ ] Configurate chatwoot enviroment. - Trivi.
- [ ] Configurate emails from container.
- [ ] Create listener flow for file's Google Drive.
- [ ] Create flow to send file data to API.
- [ ] Integrate Meta with Chatwoot.
- [X] Configure "Wompi" credentials.
- [ ] Configure "Cloudinary". - Trivi.
- [ ] Flow for updated enrollment file in Google Drive.
- [X] Configure "Cluster Mongo" With my Company email.
- [ ] Create template message. - Trivi.

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
- [] Adds color to the current link menu.
- [] Actualizar react.
- [] Change copies.
- [] Change images.
- [] Change colors.
- [] Change letter.
- [] Mobile implementation.

---

### Testing

- [] Test with slow internet connection.
- [] Test with no internet connection.
- [] Test massive user requests.
- [] Test the concurrency of users.
- [] Test the differents wompi status.

---

### Possibles features

1. Send message to user when the transaction is finished may be using N8N or the API 
2. Flow for notified to the admin about a new enrollment, may be using N8N or the API

- (Depends on the API complexity and the chatwoot persistent, as messages from chatwoot may not be visible when sent via the API).




Boton de limpiar filtros.
Es importante que escriban correctamente la sede, por eso deberiamos de marcar unicamente 0 o 1.



https://sandbox.wompi.co/v1/transactions/12004440-1765806653-78678

https://production.wompi.co/v1/transactions/{TRANSACTION_ID}