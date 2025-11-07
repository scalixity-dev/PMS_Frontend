import LoginFormImage from './sections/LoginFormImage';
import LoginForm from './sections/loginForm';

const LoginPage: React.FC = () => {

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* background image - left side*/}
      <div 
          className="absolute w-[551.2px] h-[387.32px] bg-[#20CC9540] opacity-70 rounded-full" 
          style={{
          left: '0px',
          top: '0px',
          transform: 'translate(-60%, 40%) rotate(25deg)',
          }}
      />

      <div className="flex flex-col lg:flex-row max-w-5xl w-full bg-white rounded-lg overflow-hidden">
        <LoginForm />
        <LoginFormImage />
      </div>
    </div>
  );
};

export default LoginPage;