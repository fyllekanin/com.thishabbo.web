<?php

use Illuminate\Support\Facades\Route;

Route::get('/slim-categories', 'Forum\Category\CategoryCrudController@getCategoryList');

Route::post('/thread/like/post/{postId}', 'Forum\Post\PostActionController@likePost');
Route::delete('/thread/unlike/post/{postId}', 'Forum\Post\PostActionController@unlikePost');

Route::post('/thread', 'Forum\Thread\ThreadCrudController@createThread');
Route::post('/thread/update/{threadId}', 'Forum\Thread\ThreadCrudController@updateThread');

Route::post('/thread/{threadId}', 'Forum\Post\PostCrudController@createPost');
Route::put('/thread/post/{postId}', 'Forum\Post\PostCrudController@updatePost');
Route::get('/thread/post/{postId}/history', 'Forum\Post\PostCrudController@getEditHistory');

Route::get('/category/{categoryId}/thread/{threadId}', 'Forum\Thread\ThreadCrudController@getThreadController');
Route::post('/category/{categoryId}/subscribe', 'Forum\Category\CategoryActionController@createSubscription');
Route::delete('/category/{categoryId}/unsubscribe', 'Forum\Category\CategoryActionController@deleteSubscription');

Route::post('/thread/subscribe/{threadId}', 'Forum\Thread\ThreadActionController@createThreadSubscription');
Route::delete('/thread/unsubscribe/{threadId}', 'Forum\Thread\ThreadActionController@deleteThreadSubscription');

Route::post('/thread/{threadId}/vote', 'Forum\Thread\ThreadActionController@createVote');

Route::post('/category/{categoryId}/ignore', 'Forum\Category\CategoryActionController@createIgnore');
Route::delete('/category/{categoryId}/ignore', 'Forum\Category\CategoryActionController@deleteIgnore');

Route::post('/thread/{threadId}/ignore', 'Forum\Thread\ThreadActionController@createIgnore');
Route::delete('/thread/{threadId}/ignore', 'Forum\Thread\ThreadActionController@deleteIgnore');

Route::prefix('moderation')->group(function () {
    Route::put('/thread/approve/posts', 'Moderation\PostController@approvePosts');
    Route::put('/thread/unapprove/posts', 'Moderation\PostController@unApprovePosts');
    Route::put('/thread/delete/posts', 'Moderation\PostController@deletePosts');
    Route::put('/thread/merge-posts/{threadId}', 'Moderation\PostController@mergePosts');

    Route::put('/thread/move/category/{categoryId}', 'Moderation\ThreadController@moveThreads');
    Route::put('/thread/change-owner', 'Moderation\ThreadController@changeOwner');
    Route::put('/thread/open/{threadId}', 'Moderation\ThreadController@openThread');
    Route::put('/thread/close/{threadId}', 'Moderation\ThreadController@closeThread');
    Route::put('/thread/unapprove/{threadId}', 'Moderation\ThreadController@unapproveThread');
    Route::put('/thread/approve/{threadId}', 'Moderation\ThreadController@approveThread');
    Route::put('/thread/sticky/{threadId}', 'Moderation\ThreadController@stickyThread');
    Route::put('/thread/unsticky/{threadId}', 'Moderation\ThreadController@unstickyThread');
    Route::delete('/thread/delete/{threadId}', 'Moderation\ThreadController@deleteThread');
    Route::delete('/thread/poll/delete/{threadId}', 'Moderation\ThreadPollController@deletePoll');

    Route::post('/post/report', 'Forum\Post\PostCrudController@createReportPost');
});