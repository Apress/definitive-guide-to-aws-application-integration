import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;

import java.util.HashMap;

//Following dependencies are necessary in your project for this code to be executed.
//Use following maven dependency com.amazonaws:aws-java-sdk-dynamodb:1.11.534
//Alternatively you can download Jars from maven central and add them as dependencies to the project in your IDE

public class InsertRecordDynamoDB {

    public static final String TABLE_NAME = "orders";

    public static void main(String... args) {

        // The profile name you have given when configuring aws credentials in command line
        ProfileCredentialsProvider profileCredentialsProvider = new ProfileCredentialsProvider("admin");
        final AmazonDynamoDB ddb = AmazonDynamoDBClientBuilder.standard()
                                                              .withCredentials(profileCredentialsProvider)
                                                              .build();

        HashMap<String, AttributeValue> item_values = new HashMap<>();
        item_values.put("user_id", new AttributeValue("789"));
        item_values.put("order_time", new AttributeValue("2019-02-29 00:00:00"));
        item_values.put("total_amount", new AttributeValue("11.95"));

        ddb.putItem(TABLE_NAME, item_values);
        System.out.println("Item inserted successfully");
    }
}