# @vgerbot/use-service-react

## Example

```tsx
import { Observable, IoC, useService } from '@vgerbot/use-service-react';
import { observable, action } from 'mobx';

@Observable()
class UserService {
    @observable authorized = false;

    @action login() {
        this.authorized = true;
    }
    @action logout() {
        this.authorized = false;
    }
}

function App() {
    return <IoC>
        <UserStatus></UserStatus>
    </IoC>
}

const UserStatus = observer(() => {
    const userService = useService(UserService);
    return <div>{userService.authorized ? <Logout></Logout> : <Login></Login>}</div>
})

function Login() {
    const userService = useService(UserService);
    return <button onClick={() => { userService.login() }}>Login</button>
}
function Logout() {
    const userService = useService(UserService);
    return <button onClick={() => { userService.logout() }}>Logout</button>
}
```
