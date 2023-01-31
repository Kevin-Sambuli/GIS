from celery.schedules import crontab
from django.http.response import HttpResponse
from django.shortcuts import get_object_or_404, render
from PIL import Image
from PIL.ExifTags import TAGS
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

# from django_celery_beat.models import PeriodicTask, CrontabSchedule
from .tasks import send_mail_func

# import json


def send_mail_to_all(request):
    send_mail_func.delay()
    return HttpResponse("Sent")


# def schedule_mail(request):
#     schedule, created = CrontabSchedule.objects.get_or_create(hour = 1, minute = 34)
#     task = PeriodicTask.objects.create(crontab=schedule, name="schedule_mail_task_"+"5", task='send_mail_app.tasks.send_mail_func')#, args = json.dumps([[2,3]]))
#     return HttpResponse("Done")
#


# @api_view(['GET', 'POST'])
# def get_post_puppies(request):
#     # get all puppies
#     if request.method == 'GET':
#         puppies = Puppy.objects.all()
#         serializer = PuppySerializer(puppies, many=True)
#         return Response(serializer.data)
#     # insert a new record for a puppy
#     if request.method == 'POST':
#         data = {
#             'name': request.data.get('name'),
#             'age': int(request.data.get('age')),
#             'breed': request.data.get('breed'),
#             'color': request.data.get('color')
#         }
#         serializer = PuppySerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['GET', 'DELETE', 'PUT'])
# def get_delete_update_puppy(request, pk):
#     try:
#         puppy = Puppy.objects.get(pk=pk)
#     except Puppy.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
#
#     # get details of a single puppy
#     if request.method == 'GET':
#         serializer = PuppySerializer(puppy)
#         return Response(serializer.data)
#
#     # update details of a single puppy
#     if request.method == 'PUT':
#         serializer = PuppySerializer(puppy, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#     # delete a single puppy
#     if request.method == 'DELETE':
#         puppy.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


class CartItemViews(APIView):
    def get(self, request, id=None):
        if id:
            item = CartItem.objects.get(id=id)
            serializer = CartItemSerializer(item)
            return Response(
                {"status": "success", "data": serializer.data},
                status=status.HTTP_200_OK,
            )

        items = CartItem.objects.all()
        serializer = CartItemSerializer(items, many=True)
        return Response(
            {"status": "success", "data": serializer.data}, status=status.HTTP_200_OK
        )

    def post(self, request):
        serializer = CartItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": "success", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"status": "error", "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def patch(self, request, id=None):
        item = CartItem.objects.get(id=id)
        serializer = CartItemSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": "success", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"status": "error", "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request, id=None):
        item = get_object_or_404(CartItem, id=id)
        item.delete()
        return Response({"status": "success", "data": "Item Deleted"})


# class CartItemViews(APIView):
#     # path('cart-items/<int:id>', CartItemViews.as_view())
#     def post(self, request):
#         serializer = CartItemSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
#         else:
#             return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
#
#     def get(self, request, id=None):
#         if id:
#             item = CartItem.objects.get(id=id)
#             serializer = CartItemSerializer(item)
#             return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
#
#         items = CartItem.objects.all()
#         serializer = CartItemSerializer(items, many=True)
#         return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
#
#     def patch(self, request, id=None):
#         item = CartItem.objects.get(id=id)
#         serializer = CartItemSerializer(item, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"status": "success", "data": serializer.data})
#         else:
#             return Response({"status": "error", "data": serializer.errors})
#
#     def delete(self, request, id=None):
#         item = get_object_or_404(CartItem, id=id)
#         item.delete()
#         return Response({"status": "success", "data": "Item Deleted"})
#
#
# from django.shortcuts import render
# from django.http import Http404
#
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
#
# from transformers.models import Transformer
# from transformers.serializers import TransformerSerializer


# from django.urls import path
# from rest_framework.urlpatterns import format_suffix_patterns
# from transformers import views
#
# urlpatterns = [
# 	path('transformers/', views.TransformerList.as_view()),
# 	path('transformers/<int:pk>/', views.TransformerDetail.as_view()),
# ]
#
# urlpatterns = format_suffix_patterns(urlpatterns)

#
# class TransformerList(APIView):
#     """
#     List all Transformers, or create a new Transformer
#     """
#
#     def get(self, request, format=None):
#         transformers = Transformer.objects.all()
#         serializer = TransformerSerializer(transformers, many=True)
#         return Response(serializer.data)
#
#     def post(self, request, format=None):
#         serializer = TransformerSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data,
#                             status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#

# class TransformerDetail(APIView):
#     """
#     Retrieve, update or delete a transformer instance
#     """
#
#     def get_object(self, pk):
#         # Returns an object instance that should
#         # be used for detail views.
#         try:
#             return Transformer.objects.get(pk=pk)
#         except Transformer.DoesNotExist:
#             raise Http404
#
#     def get(self, request, pk, format=None):
#         transformer = self.get_object(pk)
#         serializer = TransformerSerializer(transformer)
#         return Response(serializer.data)
#
#     def put(self, request, pk, format=None):
#         transformer = self.get_object(pk)
#         serializer = TransformerSerializer(transformer, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#     def patch(self, request, pk, format=None):
#         transformer = self.get_object(pk)
#         serializer = TransformerSerializer(transformer,
#                                            data=request.data,
#                                            partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#     def delete(self, request, pk, format=None):
#         transformer = self.get_object(pk)
#         transformer.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


"""MIXINS"""
from rest_framework import generics, mixins

# from transformers.models import Transformer
# from transformers.serializers import TransformerSerializer
#
# class TransformerList(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
# 	queryset = Transformer.objects.all()
# 	serializer_class = TransformerSerializer
#
# 	def get(self, request, *args, **kwargs):
# 		return self.list(request, *args, **kwargs)
#
# 	def post(self, request, *args, **kwargs):
# 		return self.create(request, *args, **kwargs)
#
# class TransformerDetail(mixins.RetrieveModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
# 	queryset = Transformer.objects.all()
# 	serializer_class = TransformerSerializer
#
# 	def get(self, request, *args, **kwargs):
# 		return self.retrieve(request, *args, **kwargs)
#
# 	def put(self, request, *args, **kwargs):
# 		return self.update(request, *args, **kwargs)
#
# 	def patch(self, request, *args, **kwargs):
# 		return self.partial_update(request, *args, **kwargs)
#
# 	def delete(self, request, *args, **kwargs):
# 		return self.destroy(request, *args, **kwargs)


"""Generic class-based views"""
# from rest_framework import generics
#
# from transformers.models import Transformer
# from transformers.serializers import TransformerSerializer

# class ListCreateAPIView(mixins.ListModelMixin,mixins.CreateModelMixin, GenericAPIView):
# def get(self, request, *args, **kwargs):
#     return self.list(request, *args, **kwargs)
#
# def post(self, request, *args, **kwargs):
#     return self.create(request, *args, **kwargs)
#
# class TransformerList(generics.ListCreateAPIView):
# 	queryset = Transformer.objects.all()
# 	serializer_class = TransformerSerializer
#
#
# class TransformerDetail(generics.RetrieveUpdateDestroyAPIView):
# 	queryset = Transformer.objects.all()
# 	serializer_class = TransformerSerializer
#


"""Function Based Views"""
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.response import Response

# from transformers.models import Transformer
# from transformers.serializers import TransformerSerializer
#
#
# @csrf_exempt
# def transformer_list(request):
# 	"""
# 	ere the code uses @csrf_exempt decorator to set a CSRF (Cross-Site Request Forgery) cookie.
# 	This makes it possible to POST to this view from clients that won’t have a CSRF token
#     List all transformers, or create a new transformer
#     """
# 	if request.method == 'GET':
# 		transformer = Transformer.objects.all()
# 		serializer = TransformerSerializer(transformer, many=True)
# 		return JsonResponse(serializer.data, safe=False)
#
# 	elif request.method == 'POST':
# 		data = JSONParser().parse(request)
# 		serializer = TransformerSerializer(data=data)
# 		if serializer.is_valid():
# 			serializer.save()
# 			return JsonResponse(serializer.data, status=201)
# 		return JsonResponse(serializer.errors, status=400)
#
#
# @csrf_exempt
# def transformer_detail(request, pk):
# 	try:
# 		transformer = Transformer.objects.get(pk=pk)
# 	except Transformer.DoesNotExist:
# 		return HttpResponse(status=404)
#
# 	if request.method == 'GET':
# 		serializer = TransformerSerializer(transformer)
# 		return JsonResponse(serializer.data)
#
# 	elif request.method == 'PUT':
# 		data = JSONParser().parse(request)
# 		serializer = TransformerSerializer(transformer, data=data)
#
# 		if serializer.is_valid():
# 			serializer.save()
# 			return JsonResponse(serializer.data)
# 		return JsonResponse(serializer.errors, status=400)
#
# 	elif request.method == 'DELETE':
# 		transformer.delete()
# 		return HttpResponse(status=204)


# from transformers.models import Transformer
# from transformers.serializers import TransformerSerializer
#
# @api_view(['GET','POST'])
# def transformer_list(request):
# 	"""
# 	List all transformers, or create a new transformer
# 	"""
# 	if request.method == 'GET':
# 		transformer = Transformer.objects.all()
# 		serializer = TransformerSerializer(transformer, many=True)
# 		return Response(serializer.data)
#
# 	elif request.method == 'POST':
# 		serializer = TransformerSerializer(data=request.data)
# 		if serializer.is_valid():
# 			serializer.save()
# 			return Response(serializer.data,
# 							status=status.HTTP_201_CREATED)
# 		return Response(serializer.errors,
# 						status=status.HTTP_400_BAD_REQUEST)
#
# @api_view(['GET','PUT','PATCH','DELETE'])
# def transformer_detail(request, pk):
# 	try:
# 		transformer = Transformer.objects.get(pk=pk)
# 	except Transformer.DoesNotExist:
# 		return Response(status=status.HTTP_404_NOT_FOUND)
#
# 	if request.method == 'GET':
# 		serializer = TransformerSerializer(transformer)
# 		return Response(serializer.data)
#
# 	elif request.method == 'PUT':
# 		serializer = TransformerSerializer(transformer, data=request.data)
#
# 		if serializer.is_valid():
# 			serializer.save()
# 			return Response(serializer.data)
# 		return Response(serializer.errors,
# 						status=status.HTTP_400_BAD_REQUEST)
# 	elif request.method == 'PATCH':
# 		serializer = TransformerSerializer(transformer,
# 										data=request.data,
# 										partial=True)
#
# 		if serializer.is_valid():
# 			serializer.save()
# 			return Response(serializer.data)
# 		return Response(serializer.errors,
# 						status=status.HTTP_400_BAD_REQUEST)
#
# 	elif request.method == 'DELETE':
# 		transformer.delete()
# 		return Response(status=status.HTTP_204_NO_CONTENT)


def image_metadata(img):
    """the function gets the metadata of an image i.e date, gps"""
    image = Image.open(img)

    """ reducing the image size"""
    print(f"Original size : {image.size}")  # 5464x3640
    sunset_resized = image.resize((400, 400))

    print(sunset_resized.size)
    sunset_resized.save("sunset_400.jpeg")

    # extracting the exif metadata
    exif_data = image.getexif()

    # looping through all the tags present in exif_data
    for tag_id in exif_data:
        # getting the tag name instead of tag id
        tag_name = TAGS.get(tag_id, tag_id)

        # passing the tag_id to get its respective value
        value = exif_data.get(tag_id)

        # printing the final result
        print(f"{tag_name:25}: {value}")
