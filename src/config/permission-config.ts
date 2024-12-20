interface PermissionConfigInterface {
  roles: Array<rolePayload>;
  defaultRoutes?: Array<RoutePayloadInterface>;
  modules: Array<ModulesPayloadInterface>;
}

export interface ModulesPayloadInterface {
  name: string;
  resource: string;
  route?: string;
  permissions?: Array<PermissionPayload>;
  hasSubmodules: boolean;
  submodules?: Array<SubModulePayloadInterface>;
}

export interface SubModulePayloadInterface {
  name: string;
  resource?: string;
  route?: string;
  permissions?: Array<PermissionPayload>;
}

interface rolePayload {
  id: number;
  name: string;
  description: string;
}

export interface PermissionPayload {
  name: string;
  resource?: string;
  route: Array<RoutePayloadInterface>;
}

export interface RoutePayloadInterface {
  path: string;
  method: MethodList;
  resource?: string;
  description?: string;
  isDefault?: boolean;
}

export enum MethodList {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
  ANY = 'any',
  OPTIONS = 'options'
}

export const PermissionConfiguration: PermissionConfigInterface = {
  roles: [
    {
      id: 1,
      name: 'superuser',
      description: 'superuser of the system'
    },
    {
      id: 2,
      name: 'customer',
      description: 'normal user of the system'
    },
    {
      id: 3,
      name: 'technician',
      description: 'technician registered in the system'
    },
    {
      id: 4,
      name: 'technician team leader',
      description: 'leader of a technician team'
    }
  ],
  // those routes won't require a specific permission
  defaultRoutes: [
    {
      path: '/check',
      method: MethodList.GET
    },
    {
      path: '/auth/register',
      method: MethodList.POST
    },
    {
      path: '/auth/login',
      method: MethodList.POST
    },
    {
      path: '/auth/profile',
      method: MethodList.GET
    },
    {
      path: '/auth/activate-account',
      method: MethodList.GET
    },
    {
      path: '/auth/forgot-password',
      method: MethodList.PUT
    },
    {
      path: '/auth/reset-password',
      method: MethodList.PUT
    },
    {
      path: '/auth/change-password',
      method: MethodList.PUT
    },
    {
      path: '/auth/profile',
      method: MethodList.PUT
    },
    {
      path: '/revoke/:id',
      method: MethodList.PUT
    },
    {
      path: '/auth/token-info',
      method: MethodList.GET
    },
    {
      path: '/dashboard/users',
      method: MethodList.GET
    },
    {
      path: '/dashboard/os',
      method: MethodList.GET
    },
    {
      path: '/dashboard/browser',
      method: MethodList.GET
    },
    {
      path: '/logout',
      method: MethodList.POST
    }
  ],
  modules: [
    {
      name: 'User management',
      resource: 'user',
      hasSubmodules: false,
      permissions: [
        {
          name: 'View all user',
          route: [
            {
              path: '/users',
              method: MethodList.GET
            }
          ]
        },
        // {
        //   name: 'Store new user',
        //   route: [
        //     {
        //       path: '/users',
        //       method: MethodList.POST
        //     }
        //   ]
        // },
        {
          name: 'Store new admin',
          route: [
            {
              path: '/create-admin',
              method: MethodList.POST
            }
          ]
        },
        {
          name: 'Store new technician',
          route: [
            {
              path: '/create-technician',
              method: MethodList.POST
            }
          ]
        },
        {
          name: 'Store new customer',
          route: [
            {
              path: '/create-customer',
              method: MethodList.POST
            }
          ]
        },
        {
          name: 'Update user by id',
          route: [
            {
              path: '/users/:id',
              method: MethodList.PUT
            }
          ]
        },
        {
          name: 'Get user by id',
          route: [
            {
              path: '/users/:id',
              method: MethodList.GET
            }
          ]
        }
      ]
    },
    {
      name: 'Role management',
      resource: 'role',
      hasSubmodules: false,
      permissions: [
        {
          name: 'View all role',
          route: [
            {
              path: '/roles',
              method: MethodList.GET
            }
          ]
        },
        {
          name: 'View role by id',
          route: [
            {
              path: '/roles/:id',
              method: MethodList.GET
            }
          ]
        },
        {
          name: 'Store new role',
          route: [
            {
              path: '/roles',
              method: MethodList.POST
            }
          ]
        },
        {
          name: 'Update role by id',
          route: [
            {
              path: '/roles/:id',
              method: MethodList.PUT
            }
          ]
        },
        {
          name: 'Delete role by id',
          route: [
            {
              path: '/roles/:id',
              method: MethodList.DELETE
            }
          ]
        }
      ]
    },
    {
      name: 'Permission management',
      resource: 'permission',
      hasSubmodules: false,
      permissions: [
        {
          name: 'View all permission',
          route: [
            {
              path: '/permissions',
              method: MethodList.GET
            }
          ]
        },
        {
          name: 'Sync permission from config',
          route: [
            {
              path: '/permissions/sync',
              method: MethodList.POST
            }
          ]
        },
        {
          name: 'View permission by id',
          route: [
            {
              path: '/permissions/:id',
              method: MethodList.GET
            }
          ]
        },
        {
          name: 'Store new permission',
          route: [
            {
              path: '/permissions',
              method: MethodList.POST
            }
          ]
        },
        {
          name: 'Update permission by id',
          route: [
            {
              path: '/permissions/:id',
              method: MethodList.PUT
            }
          ]
        },
        {
          name: 'Delete permission by id',
          route: [
            {
              path: '/permissions/:id',
              method: MethodList.DELETE
            }
          ]
        }
      ]
    },
    {
      name: 'Email Templates',
      resource: 'emailTemplates',
      hasSubmodules: false,
      permissions: [
        {
          name: 'View all email templates',
          route: [
            {
              path: '/email-templates',
              method: MethodList.GET
            }
          ]
        },
        {
          name: 'View email templates by id',
          route: [
            {
              path: '/email-templates/:id',
              method: MethodList.GET
            }
          ]
        },
        {
          name: 'Store new email templates',
          route: [
            {
              path: '/email-templates',
              method: MethodList.POST
            }
          ]
        },
        {
          name: 'Update email templates by id',
          route: [
            {
              path: '/email-templates/:id',
              method: MethodList.PUT
            }
          ]
        },
        {
          name: 'Delete email templates by id',
          route: [
            {
              path: '/email-templates/:id',
              method: MethodList.DELETE
            }
          ]
        }
      ]
    },
    {
      name: 'Order management',
      resource: 'order',
      hasSubmodules: false,
      permissions: [
        {
          name: 'View all orders',
          route: [
            {
              path: '/orders',
              method: MethodList.GET
            }
          ]
        },
        {
          name: 'View order by id',
          route: [
            {
              path: '/orders/:id',
              method: MethodList.GET
            }
          ]
        },
        {
          name: 'Store new order',
          route: [
            {
              path: '/orders',
              method: MethodList.POST
            }
          ]
        },
        {
          name: 'Update order by id',
          route: [
            {
              path: '/orders/:id',
              method: MethodList.PATCH
            }
          ]
        },
        {
          name: 'Mark order as In-Progress',
          route: [
            {
              path: '/orders/:id/status/in-progress',
              method: MethodList.PATCH
            }
          ]
        },
        {
          name: 'Mark order as Done',
          route: [
            {
              path: '/orders/:id/status/done',
              method: MethodList.PATCH
            }
          ]
        },
        {
          name: 'Delete order by id',
          route: [
            {
              path: '/orders/:id',
              method: MethodList.DELETE
            }
          ]
        }
      ]
    },
    {
      name: 'Technician Team management',
      resource: 'technicianTeam',
      hasSubmodules: false,
      permissions: [
        {
          name: 'View all technician Teams',
          route: [
            {
              path: '/technician-teams',
              method: MethodList.GET
            }
          ]
        },
        {
          name: 'View available teams and times',
          route: [
            {
              path: '/technician-teams/available-teams',
              method: MethodList.GET
            }
          ]
        },
        {
          name: 'View technician team by id',
          route: [
            {
              path: '/technician-teams/:id',
              method: MethodList.GET
            }
          ]
        },
        {
          name: 'Store new technician team',
          route: [
            {
              path: '/technician-teams',
              method: MethodList.POST
            }
          ]
        },
        {
          name: 'Update technician team by id',
          route: [
            {
              path: '/technician-teams/:id',
              method: MethodList.PATCH
            }
          ]
        },
        {
          name: 'Delete technician team by id',
          route: [
            {
              path: '/technician-teams/:id',
              method: MethodList.DELETE
            }
          ]
        }
      ]
    }
  ]
};
