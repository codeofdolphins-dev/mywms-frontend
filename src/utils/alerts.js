import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

const successAlert = (message = "Signed in successfully") => {
    const Toast = MySwal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "success",
        title: message
    });
}

const warningAlert = (message = "Not Possible!!!") => {
    const Toast = MySwal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "warning",
        title: message
    });
}

const errorAlert = (message = "something wrong!") => {
    MySwal.fire({
        title: "Error!",
        text: message,
        icon: "error"
    });
}

const errorToastAlert = (message = "something wrong!") => {
    const Toast = MySwal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "error",
        title: message,
        color: "white",
        iconColor: "white",
        background: "#FF6467",
        customClass: {
            title: "white"
        }
    });
}

const confirmation = async (msg = "You won't be able to revert this!") => {
    const result = await MySwal.fire({
        title: "Are you sure?",
        text: msg,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        draggable: true
    });

    return result.isConfirmed;
}

const inputAlert = async (title = "Enter details", placeholder = "Type here...") => {
    return await MySwal.fire({
        title: title,
        input: "text",
        inputPlaceholder: placeholder,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Submit"
    });
};

/* inputOptions can be an object or Promise */
// const inputOptions = new Promise((resolve) => {
//     setTimeout(() => {
//         resolve({
//             "#ff0000": "Red",
//             "#00ff00": "Green",
//             "#0000ff": "Blue"
//         });
//     }, 1000);
// });
// const { value: color } = await Swal.fire({
//     title: "Select color",
//     input: "radio",
//     inputOptions,
//     inputValidator: (value) => {
//         if (!value) return "You need to choose something!";
//     }
// });
// if (color) Swal.fire({ html: `You selected: ${color}` });

const option = {
    "1": "One",
    "2": "Two",
    "3": "Three"
};

const radioAlert = async (title = "Select color", options = option) => {
    return await Swal.fire({
        title,
        input: "radio",
        inputOptions: options,
        inputValidator: (value) => {
            if (!value) return "You need to choose something!";
        }
    });
}

export { successAlert, errorAlert, confirmation, warningAlert, inputAlert, errorToastAlert, radioAlert };