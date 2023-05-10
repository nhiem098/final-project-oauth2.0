<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:api', 'scope:view-user'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:api'])->group(function () {
    Route::get('/posts', 'Api\PostsController@index')->middleware(['scope:view-posts']);
    Route::get('/posts/create', 'Api\PostsController@create')->middleware(['scope:create-posts']);
    Route::post('/posts', 'Api\PostsController@store')->middleware(['scope:create-posts']);
    Route::get('/posts/{id}/edit', 'Api\PostsController@edit')->middleware(['scope:edit-posts']);
    Route::put('/posts/{id}', 'Api\PostsController@update')->middleware(['scope:edit-posts']);
    Route::delete('/posts/{id}', 'Api\PostsController@destroy')->middleware(['scope:delete-posts']);
});
