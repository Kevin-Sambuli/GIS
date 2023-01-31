import xmltodict
import json


def xml_to_json(xml_response):
    # Convert the XML to a dictionary
    xml_dict = xmltodict.parse(xml_response)

    # Convert the dictionary to JSON
    json_response = json.dumps(xml_dict)

    return json_response


"""Alternatively, you can use the xmltodict.unparse method with json options to convert the XML to JSON. Here is an 
example: """


def xml_to_json2(xml_response):
    json_response = xmltodict.unparse(xmltodict.parse(xml_response), pretty=True)
    return json_response


def create_toc(xml_response):
    # Convert the XML to a dictionary
    xml_dict = xmltodict.parse(xml_response)

    # Extract the feature types from the dictionary
    feature_types = xml_dict['wfs:WFS_Capabilities']['FeatureTypeList']['FeatureType']

    # Create an empty list to hold the TOC items
    toc_items = []

    # Iterate through the feature types
    for feature_type in feature_types:
        # Extract the name and title of the feature type
        name = feature_type['Name']['#text']
        title = feature_type['Title']['#text']

        # Create a TOC item for the feature type
        toc_item = {'name': name, 'title': title}

        # Add the TOC item to the list
        toc_items.append(toc_item)

    return toc_items
