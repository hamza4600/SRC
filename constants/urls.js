const urls = {
    homePage: {exact: true, path: '/'},
    forbiddenPage: {exact: true, path: '/forbidden'},
    signInPage: {exact: true, path: '/auth/admin/sign-in'},
    signUpPage: {exact: true, path: '/auth/admin/sign-up'},
    signInGuestPage: {exact: true, path: '/auth/admin/guest-sign-in'},
    requestPasswordReset: {exact: true, path: '/auth/admin/request-password-reset'},
    resetPassword: {exact: true, path: '/auth/admin/reset-password'},
    updatePassword: {exact: true, path: '/auth/admin/update-password'},

    // public
    showroomView: {exact: true, path: '/showrooms/:showroomId/:roomId?'},
    dynamicShowroomView: { exact: true, path: '/dynamic-showrooms/:showroomId/:roomId?'},
    showroomRoomView: (id, roomId) => `/showrooms/${id}/${roomId}`,
    confirmEmailPage: {exact: true, path: '/auth/admin/confirm-email'},
    aboutPage: {exact: true, path: '/about'},

    // admin
    addTentant: {exact: true, path: '/admin/showrooms/:id/tenants'},
    showroomAdminView: {exact: true, path: '/admin/showrooms/:id'},
    showroomIndex: {exact: true, path:'/admin/showrooms'},
}

export const apiUrls = {
    addTentant: id => '/showrooms/:id/tenants'.replace(':id', id),
    userIndex: '/users',
    showroomIndex: '/showrooms',
    showroomDetails: id => '/showrooms/:id'.replace(':id', id),
}

export default urls
