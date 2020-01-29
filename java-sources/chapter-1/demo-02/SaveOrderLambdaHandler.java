import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.lambda.runtime.Context;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;

public class SaveOrderLambdaHandler {
    public String handleRequest(Order input, Context context) {

        AmazonDynamoDB ddb = AmazonDynamoDBClientBuilder.defaultClient();

        HashMap<String, AttributeValue> item_values = new HashMap<>();
        item_values.put("user_id", new AttributeValue( input.getUser_id()));
        item_values.put("order_time", new AttributeValue((LocalDateTime.now().format(DateTimeFormatter.ofPattern("YYYY-MM-dd HH:mm:ss")))));
        item_values.put("total_amount", new AttributeValue(input.getTotal_amount().toString()));

        ddb.putItem("orders", item_values);
        System.out.println("Item inserted successfully");
        return "Item inserted successfully";
    }

    public static void main(String... args) {
        Order o = new Order();
        o.setUser_id("123");
        o.setTotal_amount(10.5);
        new SaveOrderLambdaHandler().handleRequest(o, null);
    }
}