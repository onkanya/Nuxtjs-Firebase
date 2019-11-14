export default function ({ store, redirect }) {
    // If the user is not authenticated
    if (!localStorage.getItem('firebase_user_data')) {
      return redirect('/login')
    }
  }