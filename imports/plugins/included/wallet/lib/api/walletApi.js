/* eslint-disable no-undef */
export const enableButton = (template, buttonText) => {
  template.$(":input").removeAttr("disabled");
  template.$("#btn-complete-order").text(buttonText);
  return template.$("#btn-processing").addClass("hidden");
};

export const paymentAlert = (template, errorMessage) => {
  return template.$(".alert").removeClass("hidden").text(errorMessage);
};

export const hidePaymentAlert = () => {
  return $(".alert").addClass("hidden").text("");
};

export const handlePaystackSubmitError = (template, error) => {
  const serverError = error !== null ? error.message : void 0;
  if (serverError) {
    return paymentAlert(template, "Oops! " + serverError);
  }
  return paymentAlert(template, "Oops! " + error, null, 4);
};
