import { writable } from 'svelte/store';

export const ticketUploadStore = writable({
  fotoTiket: null,
  fotoTiketFile: null,
  invoice: null,
  invoiceFile: null
});
