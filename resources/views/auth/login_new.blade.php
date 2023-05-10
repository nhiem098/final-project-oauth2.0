<!doctype html>
<html lang="en" class="semi-dark">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="assets/images/favicon-32x32.png" type="image/png" />
    <!-- Bootstrap CSS -->
    <link href="{{ asset('assets/css/bootstrap.min.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/css/bootstrap-extended.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/css/style.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/css/icons.css') }}" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

    <!-- loader-->
    <link href="assets/css/pace.min.css" rel="stylesheet" />

    <title>QL Bến Xe - IvanS</title>

    <style>
		.show-icon{
			color: #1b00ff;
		}
	</style>
</head>

<body class="bg-login">

    <!--start wrapper-->
    <div class="wrapper">

        <!--start content-->
        <main class="authentication-content mt-5">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 col-lg-4 mx-auto">
                        <div class="card shadow rounded-5 overflow-hidden">
                            <div class="card-body p-4 p-sm-5">
                                <h2 class="card-title text-center w-100 mb-4">Đăng nhập</h2>
                                <form action="{{ route('user_login') }}" method="POST" class="form-body">
                                    @csrf
                                    <div class="row g-3">
                                        @foreach ($errors->all() as $error)
                                            <div class="alert alert-danger" role="alert">
                                                {{ $error }}
                                            </div>
                                        @endforeach
                                        <div class="col-12">
                                            <label for="email" class="form-label">{{ __('E-Mail Address') }}</label>
                                            <div class="ms-auto position-relative">
                                                <div class="position-absolute top-50 translate-middle-y search-icon px-3">
                                                    <i class="bi bi-person-circle"></i>
                                                </div>
                                                <input id="email" type="email" class="form-control radius-30 ps-5 @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>
                                                {{-- <input type="text" name="username" class="form-control radius-30 ps-5" id="inputUserName" placeholder="Nhập tên tài khoản"> --}}
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <label for="password" class="form-label">{{ __('Password') }}</label>
                                            <div class="ms-auto position-relative">
                                                <div class="position-absolute top-50 translate-middle-y search-icon px-3 show-password">
                                                    <i class="bi bi-eye-fill"></i>
                                                </div>
                                                <input id="password" type="password" class="form-control radius-30 ps-5 @error('password') is-invalid @enderror" name="password" required autocomplete="current-password" placeholder="********">
                                                {{-- <input type="password" name="password" class="form-control radius-30 ps-5" id="inputPassword" placeholder="********"> --}}
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <div class="col-md-6 offset-md-4">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                
                                                    <label class="form-check-label" for="remember">
                                                        {{ __('Remember Me') }}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                
                                        {{-- <div class="form-group row mb-0">
                                            <div class="col-md-8 offset-md-4">
                                                <button type="submit" class="btn btn-primary radius-30">
                                                    {{ __('Login') }}
                                                </button>
                
                                                @if (Route::has('password.request'))
                                                    <a class="btn btn-link" href="{{ route('password.request') }}">
                                                        {{ __('Forgot Your Password?') }}
                                                    </a>
                                                @endif
                                            </div>
                                        </div> --}}
                                        <div class="col-12">
                                            <div class="d-grid">
                                                <button type="submit" class="btn btn-primary radius-30">
                                                    {{ __('Login') }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!--end page main-->

    </div>
    <!--end wrapper-->


    <!--plugins-->
    <script src="{{ asset('assets/js/jquery.min.js') }}"></script>
    <script src="{{ asset('assets/js/pace.min.js') }}"></script>
    <script>
		$(document).on('click', '.show-password', function(e){
			let input_password = $(this).closest('.position-relative').find('input');
			if($(input_password).hasClass('show')){
				$(input_password).attr("type", "password");
				$(input_password).removeClass('show');
				$(this).removeClass('show-icon');
			}else{
				$(input_password).attr("type", "text");
				$(input_password).addClass('show');
				$(this).addClass('show-icon');
			}
		});
	</script>
</body>

</html>
