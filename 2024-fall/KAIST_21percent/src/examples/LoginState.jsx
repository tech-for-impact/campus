import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { Button } from '@chakra-ui/react';

function LoginState() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('로그아웃되었습니다.');
    } catch (error) {
      console.error('로그아웃에 실패했습니다:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User logged in:', user);
      } else {
        console.log('No user is logged in');
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <>
      <div>Hello</div>
      <Button colorScheme="red" onClick={handleLogout}>
        로그아웃
      </Button>
    </>
  );
}

export default LoginState;
