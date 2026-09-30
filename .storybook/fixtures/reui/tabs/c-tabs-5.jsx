// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../../../../src/components/core/Tabs/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex w-full max-w-xs flex-col gap-6'>
      <Tabs defaultValue='account'>
        <TabsList>
          <TabsTrigger value='account'>
            <RegistryIcon lucide='UserIcon' />
            Account
          </TabsTrigger>
          <TabsTrigger value='password'>
            <RegistryIcon lucide='LockIcon' />
            Password
          </TabsTrigger>
          <TabsTrigger value='settings'>
            <RegistryIcon lucide='SettingsIcon' />
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value='account'>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base'>Account</CardTitle>
              <CardDescription className='text-sm'>
                Update your account information.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='icons-name' className='text-sm'>
                  Name
                </Label>
                <Input
                  id='icons-name'
                  defaultValue='Sarah Johnson'
                  className='h-9'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='icons-email' className='text-sm'>
                  Email
                </Label>
                <Input
                  id='icons-email'
                  type='email'
                  defaultValue='sarah.johnson@example.com'
                  className='h-9'
                />
              </div>
            </CardContent>
            <CardFooter className='pt-3'>
              <Button size='sm'>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value='password'>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base'>Password</CardTitle>
              <CardDescription className='text-sm'>
                Change your password here.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='icons-current' className='text-sm'>
                  Current password
                </Label>
                <Input id='icons-current' type='password' className='h-9' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='icons-new' className='text-sm'>
                  New password
                </Label>
                <Input id='icons-new' type='password' className='h-9' />
              </div>
            </CardContent>
            <CardFooter className='pt-3'>
              <Button size='sm'>Update password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value='settings'>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base'>Settings</CardTitle>
              <CardDescription className='text-sm'>
                Manage your preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='icons-theme' className='text-sm'>
                  Theme
                </Label>
                <Input id='icons-theme' defaultValue='Light' className='h-9' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='icons-language' className='text-sm'>
                  Language
                </Label>
                <Input
                  id='icons-language'
                  defaultValue='English'
                  className='h-9'
                />
              </div>
            </CardContent>
            <CardFooter className='pt-3'>
              <Button size='sm'>Save settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
