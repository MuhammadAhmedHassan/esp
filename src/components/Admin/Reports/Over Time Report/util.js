export const checkUserRoleType = (roles = []) => {
    let roleType="";
    if (!roles.length > 0) return;

    const names = roles.map((x) => x.id);
    const userRoleIds = names.toString();

    if (roles.find((role) => role.name === "Administrators")) {
        roleType = "admin";
    } else if (roles.find((role) => role.name === "Manager")) {
        roleType = "manager";
    } else if (roles.length > 0) {
        roleType = "user";
    }

    return {
        roleType,
        userRoleIds,
    };
};


export const tableHeader = [
    'Employee',
    'Shift Lable',
    'Type',
    'Status',
    'Day of Week',

]

