import { Injectable } from '@angular/core';
import { Contact } from '../model/contact.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalContactService {
  savedContacts: Contact[];

  constructor() {
    const contacts = [];
    contacts.push({
      id: '234',
      firstName: 'Anakin',
      lastName: 'Skywalker',
      email: 'ani@sand.com',
    });
    contacts.push({
      id: '666',
      firstName: 'Palpatine',
      contactNumber: 6666666,
      email: 'loves@democracy.com',
    });
    contacts.push({
      id: '973',
      firstName: 'Obi-Wan',
      email: 'hellothere@highground.com',
    });
    this.savedContacts = contacts;
    this.savedContacts = this.sortContacts(this.savedContacts);
  }

  addContact(addFormData) {
    const tempContact: Contact = {
      id: this.generateUniqueId(),
      firstName: this.capitalizeFirstLetter(addFormData.firstName),
    };
    if (addFormData.lastName !== '') {
      tempContact.lastName = this.capitalizeFirstLetter(addFormData.lastName);
    }
    if (addFormData.contactNumber !== '') {
      tempContact.contactNumber = addFormData.contactNumber;
    }
    if (addFormData.email !== '') {
      tempContact.email = addFormData.email;
    }

    this.savedContacts.push(tempContact);
    this.savedContacts = this.sortContacts(this.savedContacts);
  }

  private sortContacts(contacts): Contact[] {
    return contacts.sort((contactA, contactB) =>
      contactA.firstName > contactB.firstName ? 1 : -1
    );
  }

  getAllContacts() {
    return this.savedContacts;
  }

  // this function starts a counter at the current length of getAllContacts()
  // it increments the counter, and then checks if that id exists in current list of contacts
  // if it does, it increments and repeats the last step
  // if it doesn't, it returns this counter value
  // this primitive method ensures uniqueIds for a small number of contacts
  // this method will not be used once firebase backend will be able to assign uuids automatically
  private generateUniqueId() {
    let uniqueId = this.getAllContacts().length;
    do {
      uniqueId++;
    } while (this.getContactById(uniqueId) !== undefined);
    return uniqueId.toString();
  }

  private capitalizeFirstLetter(s: string): string {
    if (typeof s !== 'string') return '';
    return (s.charAt(0).toUpperCase() + s.slice(1)).toString();
  }

  getContactById(contactId: string | number) {
    if (typeof contactId === 'number') {
      contactId = contactId.toString();
    }
    const contacts = this.savedContacts;
    return contacts.filter((contact) => contact.id === contactId)[0];
  }

  updateContact(contactId, editFormData) {
    const updateIndex = this.savedContacts.findIndex(
      (c) => c.id === contactId.toString()
    );
    if (updateIndex < 0) {
      return;
    }

    this.savedContacts[updateIndex].firstName = this.capitalizeFirstLetter(
      editFormData.firstName
    );
    this.savedContacts[updateIndex].lastName = this.capitalizeFirstLetter(
      editFormData.lastName
    );
    this.savedContacts[updateIndex].contactNumber = editFormData.contactNumber;
    this.savedContacts[updateIndex].email = editFormData.email;

    this.savedContacts = this.sortContacts(this.savedContacts);
  }

  deleteContact(contactId) {
    const deleteIndex = this.savedContacts.findIndex(
      (c) => c.id === contactId.toString()
    );
    if (deleteIndex < 0) {
      return;
    }

    this.savedContacts.splice(deleteIndex, 1);
  }
}
