import Swal from "sweetalert2";

const dialogBox = async (title, text) => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#900d09",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Oui, supprimer !",
    cancelButtonText: "Annuler"
  });

  return result.isConfirmed;
};

export default dialogBox;
