import Swal, {type  SweetAlertResult } from 'sweetalert2';

export const AlertService = {
  confirm: async (
    title: string,
    text: string,
    icon: 'question' | 'warning' = 'question'
  ): Promise<SweetAlertResult> => {
    return await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonColor: icon === 'warning' ? '#d33' : '#38b2ac',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Confirm',
      customClass: {
        popup: 'rounded-[15px]' // Tailwind style rounded, or you can use style below
      },
      // Or use inline style instead of customClass:
      // width: 'auto',
      // padding: '1.25rem',
      // background: '#fff',
      // borderRadius: '15px',
    });
  },

  success: (title: string, text: string) => {
    Swal.fire({
      title,
      text,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-[15px]',
      },
    });
  },

  error: (title: string, text: string) => {
    Swal.fire({
      title,
      text,
      icon: 'error',
      customClass: {
        popup: 'rounded-[15px]',
      },
    });
  },
};
